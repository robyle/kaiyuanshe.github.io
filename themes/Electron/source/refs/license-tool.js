$(function(){
    var
        _windowWidth = $(window).width();

    if(window.matchMedia && window.matchMedia('(max-width:960px)').matches){
        $('.wrapper').css('width', _windowWidth);
        $('.input-item').css('width', _windowWidth - 50);
    }
});

//Rendering Select
/*$('.singleSelect').customSelect({
    focus: function () {
        //debug('Got focus');
    },
    blur: function () {
        //debug('Lost focus');
    },
    change: function () {
        //debug('Widget value changed');
    }
});*/

//Loading License Data
$.ajax({
    url : '/template/hli/js/matrix.xml',
    dataType : "xml",
    success : function(data){
        initLicences(MX.XML.ToJSON(data.documentElement).entry);
    }
});

//Page Controller
var
    resolver = (function(){
        /*
         * Switch module
         */
        var
            optModule = $('#license-tool-options'),
            resModule = $('#license-tool-result'),
            handlePrev = $('.resolver-prev'),
            handleNext = $('.resolver-next'),
            handleComplete = $('.resolver-complete'),
            handleRestart  = $('.resolver-restart');

        var
            isHide = function(o){
                return o.css('display') == 'none';
            },

            switchModule = function(){
                var
                    optStatus = isHide(optModule),
                    resStatus = isHide(resModule),
                    curr = optStatus ? optModule : resModule;

                optModule.hide();
                resModule.hide();
                curr.show();
            };

        /*
         * Switch Step
         */
        var
            stepsContainer = $('#select-steps'),
            stepPrefix = 'select-step-',
            steps = ['1', '2-1', '2-2', '2-3', '3', '4-1', '4-2', '5', '6', '7'],
            stepsEnabled = [true, true, false, false, true, true, false, true, true, true],
            currStepIndex = -1;

        var
            switchProgress = function(stepIndex){
                $('.screening-progress .type-1').removeClass('active');
                $('#progress-step-' + stepIndex.split('-')[0]).addClass('active');
            },

            switchStep = function(stepIndex){
                $('#' + stepPrefix + steps[currStepIndex]).hide();
                currStepIndex = parseInt(stepIndex) >= 0 ? stepIndex : currStepIndex;
                $('#' + stepPrefix + steps[currStepIndex]).show();
                switchProgress(steps[currStepIndex]);
            },

            stepHistory = window.stepHistory = [],

            enabledSteps = function(index, enabled){
                stepsEnabled[index] = enabled;
            },

            getStepIndex = function(direction){
                var
                    newStep;
                if(!direction && currStepIndex == -1){
                    newStep = 0;
                    stepHistory.push(newStep);
                }else if(direction == 'prev'){
                    newStep = stepHistory.pop() && stepHistory[stepHistory.length - 1];
                }
                else {
                    //return currStepIndex + 1 >= steps.length ? steps.length - 1 : currStepIndex + 1;
                    newStep = (function(){
                        var
                            _ = stepHistory[stepHistory.length - 1];

                        for(var i = _ + 1; i < stepsEnabled.length; i++){
                            if(stepsEnabled[i])
                                return i;
                        }

                        return -1;
                    })();
                    stepHistory.push(newStep);
                }
                return newStep;
            };

        handlePrev.on('click', function(){
            switchStep(getStepIndex('prev'));
        });

        handleNext.on('click', function(){
            isInitLicenses.done();
            switchStep(getStepIndex('next'));
        });

        handleComplete.on('click', function(){
            switchModule();
        });

        handleRestart.on('click', function(){
            switchModule();
        });

        /*$('#select-steps select').on('change', function() {
            var
                _this = $(this);
            processChoice(_this.attr('id'), _this.val());
        });*/

        $('.singleSelect').customSelect({
            change: function () {
                var
                    _this = $(this);
                processChoice(_this.attr('id'), _this.val());
            }
        });

        var
            init = function(){
                switchModule();
                switchStep(getStepIndex());
            };

        init();

        return {
            enabledSteps : enabledSteps
        };

        /*return {
         switchModule : switchModule
         };*/
    })();
